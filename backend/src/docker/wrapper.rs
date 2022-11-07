// Copyright 2021. The Tari Project
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
// following disclaimer in the documentation and/or other materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote
// products derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
// USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//

use std::collections::HashMap;

use bollard::{
    image::CreateImageOptions,
    models::{CreateImageInfo, EventMessage},
    system::EventsOptions,
    Docker,
};
use derive_more::{Deref, DerefMut};
use futures::{Stream, TryStreamExt};

use crate::{docker::DockerWrapperError, rest::DockerImageError};

/// A wrapper around a [`bollard::Docker`] instance providing some opinionated convenience methods for Tari workspaces.
#[derive(Clone, Deref, DerefMut)]
pub struct DockerWrapper {
    docker: Docker,
}

impl DockerWrapper {
    /// Create a new wrapper
    pub fn connect() -> Result<Self, DockerWrapperError> {
        let docker = Docker::connect_with_local_defaults()?;
        Ok(Self { docker })
    }

    /// Returns the version of the _docker client_.
    pub fn version(&self) -> String {
        self.docker.client_version().to_string()
    }

    /// Returns a stream of relevant events. We're opinionated here, so we filter the stream to only return
    /// container, image, network and volume events.
    pub async fn events(&self) -> impl Stream<Item = Result<EventMessage, DockerWrapperError>> {
        let mut type_filter = HashMap::new();
        type_filter.insert("type".to_string(), vec![
            "container".to_string(),
            "image".to_string(),
            "network".to_string(),
            "volume".to_string(),
        ]);
        let options = EventsOptions {
            since: None,
            until: None,
            filters: type_filter,
        };
        self.docker.events(Some(options)).map_err(DockerWrapperError::from)
    }

    pub async fn pull_latest_image(
        &self,
        full_image_name: String,
    ) -> impl Stream<Item = Result<CreateImageInfo, DockerImageError>> {
        let opts = Some(CreateImageOptions {
            from_image: full_image_name,
            ..Default::default()
        });
        self.docker
            .create_image(opts, None, None)
            .map_err(DockerImageError::from)
    }
}
